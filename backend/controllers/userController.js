const Web3 = require('web3');
const User = require('../models/user');
const Transaction = require('../models/Transaction');

// Kết nối tới node Ethereum (Ganache)
const web3 = new Web3(process.env.RPC_URL || 'http://127.0.0.1:8545');

// Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { name, walletAddress, privateKey } = req.body;
    const user = new User({ name, walletAddress, privateKey });
    await user.save();
    res.status(201).json({ message: 'Đã tạo user', user });
  } catch (error) {
    console.error('Lỗi khi tạo user:', error);
    res.status(500).json({ message: 'Lỗi khi tạo user', error: error.message });
  }
};
// Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách user:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách user', error: error.message });
  }
};

// Chuyển ETH
exports.transferETH = async (req, res) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;

    // Kiểm tra địa chỉ hợp lệ
    if (!web3.utils.isAddress(fromAddress) || !web3.utils.isAddress(toAddress)) {
      return res.status(400).json({ message: 'Địa chỉ ví không hợp lệ' });
    }

    // Tìm người gửi và người nhận trong cơ sở dữ liệu
    const fromUser = await User.findOne({ address: fromAddress });
    const toUser = await User.findOne({ address: toAddress });

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'Không tìm thấy người gửi hoặc người nhận' });
    }

    const privateKey = fromUser.privateKey;
    const valueInWei = web3.utils.toWei(amount.toString(), 'ether');

    // Tạo giao dịch
    const txCount = await web3.eth.getTransactionCount(fromAddress);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: toAddress,
      value: web3.utils.toHex(valueInWei),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    };

    // Ký giao dịch
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    // Gửi giao dịch
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Lấy gas đã sử dụng và phí giao dịch
    const gasUsed = receipt.gasUsed;
    const gasPrice = web3.utils.toWei('10', 'gwei');
    const fee = web3.utils.fromWei((gasUsed * gasPrice).toString(), 'ether');

    // Lưu thông tin giao dịch vào cơ sở dữ liệu
    const transaction = new Transaction({
      from: fromAddress,
      to: toAddress,
      amount,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      status: receipt.status ? 'Thành Công' : 'Thất Bại',
      fee: fee,
      gasUsed: gasUsed,
    });

    await transaction.save();

    res.json({ message: 'Giao dịch thành công', transaction });
  } catch (error) {
    console.error('Lỗi khi chuyển ETH:', error);
    res.status(500).json({ message: 'Lỗi khi chuyển ETH', error: error.message });
  }
};

// Lấy số dư ETH từ địa chỉ ví
exports.getBalance = async (req, res) => {
  const { address } = req.params;
  const balanceInWei = await web3.eth.getBalance(address); // Lấy số dư bằng Wei
  const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether'); // Chuyển đổi sang ETH
  res.json({ address, balance: balanceInEth }); // Trả về số dư
};

// Lấy toàn bộ lịch sử giao dịch
exports.getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử giao dịch:', error);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử giao dịch', error: error.message });
  }
};
