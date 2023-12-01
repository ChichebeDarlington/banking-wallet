import { useEffect, useState } from "react";
import { getAllUser, verifyUser } from "../../apicalls/users";
import { Table, message } from "antd";
import TitlePage from "../../components/PageTitle";
import { setReloadUser } from "../../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userUpdateMethod = async (record, isVerified) => {
    dispatch(setReloadUser(true));
    try {
      const response = await verifyUser({
        selectedUser: record._id,
        isVerified,
      });
      console.log(response);
      if (response.success) {
        message.success(response.msg);
        getUsers();
        setReloadUser(false);
      } else {
        message.error(response.error);
        setReloadUser(false);
      }
    } catch (error) {
      message.error(error.error);
      setReloadUser(false);
    }
  };

  const getUsers = async () => {
    dispatch(setReloadUser(true));
    try {
      const response = await getAllUser();
      if (response.success) {
        setUsers(response.user);
        dispatch(setReloadUser(false));
      } else {
        message.error(response.error);
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      console.log(error);
      message.error(error.error);
      dispatch(setReloadUser(false));
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
    {
      title: "verified",
      dataIndex: "isVerified",
      render: (text, record) => (text ? "Yes" : "No"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) =>
        record.isVerified ? (
          <button
            className="primary-outline-btn"
            onClick={() => userUpdateMethod(record, false)}
          >
            Decline
          </button>
        ) : (
          <button
            className="primary-outline-btn"
            onClick={() => userUpdateMethod(record, true)}
          >
            Accept
          </button>
        ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  if (reload) {
    return <Loader />;
  }

  return (
    <div>
      <TitlePage />
      <Table
        dataSource={users}
        columns={columns}
        className="mt-2"
        rowKey={(record) => record._id}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Users;
