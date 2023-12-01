import { useCallback, useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Table, Tabs, message } from "antd";
import RequestModal from "./RequestModal";
import { fetchRequests, updateRequestStatus } from "../../apicalls/requests";
const { TabPane } = Tabs;
import moment from "moment";
import { setReloadUser } from "../../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

const Request = () => {
  const [request, setRequest] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { user, reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const updateStatus = async (record, status) => {
    dispatch(setReloadUser(true));
    try {
      const response = await updateRequestStatus({ ...record, status });
      if (response.success) {
        message.success(response.msg);
        getAllRequest();
        dispatch(setReloadUser(false));
      } else {
        message.error(response.error);
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      message.error(error);
      dispatch(setReloadUser(false));
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "_id",
      // responsive: ["md"],
    },
    {
      title: "sender",
      dataIndex: "sender",
      render: (text, record) =>
        `${record?.sender?.firstName} ${record?.sender?.lastName}`,
      // responsive: ["md"],
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      render: (text, record) =>
        `${record?.receiver?.firstName} ${record?.receiver?.lastName}`,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) =>
        record?.status === "pending" &&
        record?.receiver?._id === user?._id && (
          <div className="flex gap-1">
            <h1
              className="text-sm underline"
              onClick={() => updateStatus(record, "accepted")}
            >
              Accept
            </h1>
            <h1
              className="text-sm underline"
              onClick={() => updateStatus(record, "rejected")}
            >
              Reject
            </h1>
          </div>
        ),
    },
  ];

  const getAllRequest = async () => {
    dispatch(setReloadUser(true));
    try {
      const response = await fetchRequests();
      if (response?.success) {
        const sendData = response?.request?.filter(
          (item) => item?.sender?._id === user?._id
        );
        const receiveData = response?.request?.filter(
          (item) => item?.receiver?._id === user?._id
        );

        setRequest({
          sent: sendData,
          received: receiveData,
        });
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      message.error(error);
      dispatch(setReloadUser(false));
    }
  };

  useEffect(() => {
    user && getAllRequest();
  }, []);

  if (reload) {
    <Loader />;
  }

  return (
    <div>
      <div className="flex justify-between">
        <PageTitle title="Request funds" />
        <button
          className="primary-outline-btn"
          onClick={() => setShowRequestModal(true)}
        >
          Request Fund
        </button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Sent" key="1">
          <Table
            columns={columns}
            dataSource={request?.sent}
            rowKey={(record) => record._id}
            scroll={{ x: true }}
          ></Table>
        </TabPane>
        <TabPane tab="Received" key="2">
          <Table
            columns={columns}
            dataSource={request?.received}
            rowKey={(record) => record._id}
            scroll={{ x: true }}
          ></Table>
        </TabPane>
      </Tabs>
      {showRequestModal && (
        <RequestModal
          showRequestModal={showRequestModal}
          setShowRequestModal={setShowRequestModal}
          reloadModal={getAllRequest}
        />
      )}
    </div>
  );
};

export default Request;
