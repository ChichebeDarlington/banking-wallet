import { Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { transferFunds, verifyUserAccount } from "../../apicalls/transaction";

import { setReloadUser } from "../../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

const TransferModal = ({
  showTransferModal,
  setShowTransferModal,
  reloadModal,
}) => {
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user, reload } = useSelector((state) => state.user);

  const verifyAccount = async () => {
    try {
      const response = await verifyUserAccount({
        receiver: form.getFieldValue("receiver"),
      });
      if (response.success) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      setIsVerified(false);
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      sender: user?._id,
      status: "success",
      reference: values.reference || user._id,
      type: "Debit",
    };
    dispatch(setReloadUser(true));

    try {
      const response = await transferFunds(payload);
      console.log(response);
      if (response.success) {
        message.success(response.msg);
        setShowTransferModal(false);
        reloadModal();
        dispatch(setReloadUser(false));
      } else {
        message.error(response.error);
        dispatch(setReloadUser(false));
        setShowTransferModal(false);
      }
    } catch (error) {
      message.error(error);
      dispatch(setReloadUser(false));

      console.log(error);
    }
  };

  if (reload) {
    return <Loader />;
  }

  return (
    <div>
      <Modal
        title="Transfer funds"
        open={showTransferModal}
        onCancel={() => setShowTransferModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="flex gap-2 items-center">
            <Form.Item label="Account Number" name="receiver" className="w-100">
              <Input type="text" />
            </Form.Item>
            <button
              type="button"
              className="primary-contained-btn mt-1"
              onClick={verifyAccount}
            >
              Verify
            </button>
          </div>
          {isVerified === true && (
            <div className="text-sm success-bg">Account verified</div>
          )}
          {isVerified === false && (
            <div className="text-sm error-bg">Account not verified</div>
          )}

          <Form.Item
            label="Amount"
            name={"amount"}
            rules={[
              {
                required: true,
                message: "Please input the amount",
              },
              {
                max: user?.balance,
                message: "Insufficient balance",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Reference" name={"reference"} className="w-100">
            <Input.TextArea type="text" />
          </Form.Item>
          <div className="flex justify-end gap-1">
            <button
              className="primary-contained-btn"
              onClick={() => setShowTransferModal(false)}
            >
              Cancel
            </button>
            {isVerified && (
              <button className="primary-outline-btn" type="submit">
                Transfer
              </button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferModal;
