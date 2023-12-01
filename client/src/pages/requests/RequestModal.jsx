import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { verifyUserAccount } from "../../apicalls/transaction";
import { sendRequests } from "../../apicalls/requests";

import { setReloadUser } from "../../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

const RequestModal = ({
  showRequestModal,
  setShowRequestModal,
  reloadModal,
}) => {
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user, reload } = useSelector((state) => state.user);

  const verifyAccount = async () => {
    dispatch(setReloadUser(true));
    try {
      const response = await verifyUserAccount({
        receiver: form.getFieldValue("receiver"),
      });
      if (response.success) {
        dispatch(setReloadUser(false));
        setIsVerified(true);
      } else {
        setIsVerified(false);
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      setIsVerified(false);
      dispatch(setReloadUser(false));
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      sender: user?._id,
      status: "success",
      reference: values.reference || user._id,
      type: "Request",
    };
    try {
      const response = await sendRequests(payload);

      if (response.success) {
        message.success(response.msg);
        setShowRequestModal(false);
        reloadModal();
      }
      message.error(response.error);
    } catch (error) {
      message.error(error);
      console.log(error);
    }
  };

  if (reload) {
    <Loader />;
  }

  return (
    <div>
      <Modal
        title="Request funds"
        open={showRequestModal}
        onCancel={() => setShowRequestModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="flex gap-2 items-center">
            <Form.Item label="Account Number" name="receiver" className="w-100">
              <Input type="text" />
            </Form.Item>
            <Button
              type="button"
              className="primary-contained-btn mt-1"
              onClick={verifyAccount}
            >
              Verify
            </Button>
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
              type="button"
              onClick={() => setShowRequestModal(false)}
            >
              Cancel
            </button>
            {isVerified && (
              <button className="primary-outline-btn" type="submit">
                Request
              </button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RequestModal;
