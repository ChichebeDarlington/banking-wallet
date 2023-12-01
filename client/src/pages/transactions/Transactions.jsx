import { Table, message } from "antd";
import PageTitle from "../../components/PageTitle";
import TransferModal from "./TransferModal";
import { useEffect, useState } from "react";
import { getAllTransact } from "../../apicalls/transaction";
import moment from "moment";
import DepositModal from "./DepositModal";

import { setReloadUser } from "../../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

const Transactions = () => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const [transact, setTransact] = useState([]);

  const { user, reload } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD/MM/YYYY hh:mm:ss A");
      },
    },
    {
      title: "Transaction ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) =>
        record?.sender?._id === user._id
          ? "Debit"
          : record?.sender?._id === record?.receiver._id
          ? "Deposit"
          : "Credit",
    },
    {
      title: "Reference Account",
      dataIndex: "",
      render: (text, record) => {
        return record?.receiver?._id === user._id ? (
          <div>
            <h1 className="text-sm">
              {record?.receiver?.firstName} {record?.receiver?.lastName}
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-sm">
              {record?.sender?.firstName} {record?.sender?.lastName}
            </h1>
          </div>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const getTransact = async () => {
    dispatch(setReloadUser(true));
    try {
      const response = await getAllTransact();
      if (response.success) {
        setTransact(response.transact);
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      message.error(error);
      dispatch(setReloadUser(false));
    }
  };

  useEffect(() => {
    getTransact();
  }, []);

  if (reload) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <PageTitle title={"Transactions"} />
        <div className="flex gap-1">
          <button
            className="primary-contained-btn"
            onClick={() => setShowDepositModal(true)}
          >
            Deposit
          </button>
          <button
            className="primary-contained-btn"
            onClick={() => setShowTransferModal(true)}
          >
            Transter
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={transact}
        className="mt-2 table"
        rowKey={(record) => record._id}
        scroll={{ x: true }}
      />
      {showTransferModal && (
        <TransferModal
          showTransferModal={showTransferModal}
          setShowTransferModal={setShowTransferModal}
          reloadModal={getTransact}
        />
      )}
      {showDepositModal && (
        <DepositModal
          showDepositModal={showDepositModal}
          setShowDepositModal={setShowDepositModal}
          reloadModal={getTransact}
        />
      )}
    </div>
  );
};

export default Transactions;
