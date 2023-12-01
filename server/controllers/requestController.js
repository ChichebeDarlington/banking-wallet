import Request from "../models/requestModel.js";
import User from "../models/userModel.js";
import Transact from "../models/transactModel.js";

export const fetchRequest = async (req, res) => {
  try {
    const request = await Request.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ request, msg: "Request fetched successful", success: true });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      msg: "Request fetched failed",
      success: false,
    });
  }
};

export const sendRequest = async (req, res) => {
  const { receiver, amount, reference } = req.body;
  try {
    const newRequest = new Request({
      sender: req.user._id,
      receiver,
      amount,
      reference,
    });
    await newRequest.save();

    return res.status(201).json({
      newRequest,
      msg: "Request successfully sent!",
      success: true,
    });
  } catch (error) {
    return res.status(201).json({
      error: error.message,
      msg: "Request not sent!",
      success: false,
    });
  }
};

export const requestStatus = async (req, res) => {
  const { status, sender, amount, receiver } = req.body;

  try {
    if (status === "accepted") {
      const user = await Request.findOneAndUpdate(
        { _id: req.body._id },
        { status },
        { new: true }
      );

      await User.findByIdAndUpdate(sender, { $inc: { balance: amount } });

      await User.findByIdAndUpdate(receiver, {
        $inc: { balance: -amount },
      });

      const requestedTransact = new Transact({
        amount: amount,
        sender: receiver,
        receiver: sender,
        reference: req.body.reference,
        type: "Request",
        status: "Approved",
      });

      await requestedTransact.save();

      return res.status(200).json({ msg: "Request approved", success: true });
    } else if (status === "rejected") {
      await Request.findOneAndUpdate(
        { _id: req.body._id },
        { status },
        { new: true }
      );
      await User.findByIdAndUpdate(sender, { $inc: { balance: 0 } });

      await User.findByIdAndUpdate(receiver, {
        $inc: { balance: 0 },
      });
      const requestedTransact = new Transact({
        amount: amount,
        sender: receiver,
        receiver: sender,
        reference: req.body.reference,
        type: "Request",
        status: "Rejected",
      });

      await requestedTransact.save();
      return res.status(200).json({ msg: "Request rejected", success: true });
    }
  } catch (error) {
    return res.status(201).json({
      error: error.message,
      msg: "Request not sent!",
      success: false,
    });
  }
};
