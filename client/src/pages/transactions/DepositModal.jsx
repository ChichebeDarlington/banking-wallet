import { Form, Input, Modal, message } from "antd";
import StripeCheckout from "react-stripe-checkout";
import { depositTransact } from "../../apicalls/transaction";

import { setReloadUser } from "../../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useState } from "react";

const DepositModal = ({
  showDepositModal,
  setShowDepositModal,
  reloadModal,
}) => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState("");

  const dispatch = useDispatch();
  const { relaod } = useSelector((state) => state.user);

  const handleToken = async (token) => {
    dispatch(setReloadUser(true));
    try {
      const response = await depositTransact({
        token,
        // amount: form.getFieldValue("amount"),
        amount,
      });
      if (response.success) {
        dispatch(setReloadUser(true));
        message.success(response.msg);
        setShowDepositModal(false);
        reloadModal();
        setTimeout(() => {
          dispatch(setReloadUser(false));
        }, 2000);
      } else {
        message.error(response.error);
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      message.error(error);
      dispatch(setReloadUser(false));
    }
  };

  if (relaod) {
    return <Loader />;
  }

  return (
    <div>
      <Modal
        title={"Deposit"}
        open={showDepositModal}
        onCancel={() => setShowDepositModal(false)}
        footer={null}
      >
        <div className="flex flex-col gap-1">
          <Form layout="vertical">
            <Form.Item
              label="Amount"
              // name="amount"
              rules={[{ required: true, message: "Input amount" }]}
            >
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Item>
            <div className="justify-end flex gap-1">
              <button
                className="primary-outline-btn"
                onClick={() => setShowDepositModal(false)}
              >
                Cancel
              </button>
              <StripeCheckout
                amount={form.getFieldValue("amount") * 100}
                shippingAddress
                token={handleToken}
                currency="USD"
                stripeKey={import.meta.env.VITE_STRIPE_API_KEY}
              >
                <button
                  className="primary-contained-btn"
                  onClick={() => setShowDepositModal(false)}
                  type="submit"
                >
                  Deposit
                </button>
              </StripeCheckout>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default DepositModal;
