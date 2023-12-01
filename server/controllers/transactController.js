import Transact from "../models/transactModel.js";
import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const transfer = async (req, res) => {
  try {
    const transact = await Transact(req.body);
    await transact.save();

    await User.findOneAndUpdate(
      { _id: req.body.sender },
      {
        $inc: { balance: -req.body.amount },
      },
      { returnOriginal: false }
    );

    await User.findOneAndUpdate(
      { _id: req.body.receiver },
      {
        $inc: { balance: req.body.amount },
      },
      { returnOriginal: false }
    );
    return res.status(201).json({
      msg: "Transaction successful",
      transact,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Transaction failed",
      success: false,
    });
  }
};

export const fetchTransacts = async (req, res) => {
  try {
    const transact = await Transact.find({
      $or: [{ sender: req.user }, { receiver: req.user }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });
    return res.status(200).json({ transact, success: true });
  } catch (error) {
    return res
      .status(200)
      .json({ error: error.message, msg: "Error while fetch amount" });
  }
};

export const verifyUserAccount = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.receiver });
    if (user) {
      return res.status(201).json({
        msg: "Account verified",
        success: true,
      });
    } else {
      return res.status(201).json({
        error: "Account not found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error,
      msg: "Something went wrong",
      success: false,
    });
  }
};

export const deposit = async (req, res) => {
  const { token, amount } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Deposit in wallet",
      },
      { idempotencyKey: uuidv4() }
    );

    if (charge) {
      const newTransact = new Transact({
        sender: req.user,
        receiver: req.user,
        amount: amount,
        type: "Deposit",
        reference: "Stripe deposit",
        status: "Success",
      });

      await newTransact.save();

      await User.findOneAndUpdate(
        { _id: req.user },
        {
          $inc: { balance: amount },
        },
        { returnOriginal: false }
      );
      return res.status(201).json({
        success: true,
        msg: "Deposit successful",
      });
    } else {
      return res.status(400).json({
        error: "Transaction faled",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message,
      success: false,
    });
  }
};
