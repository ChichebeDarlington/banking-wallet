import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import { useSelector } from "react-redux";

const Home = () => {
  const { user, reload } = useSelector((state) => state.user);

  if (reload) {
    return <Loader />;
  }

  return (
    <div>
      <PageTitle
        title={`Hey ${user?.firstName} ${user?.lastName}, welcome to the Wallet banking app`}
        className="home-title"
      />

      <div className="home-container bg-tertiary text-white p-2 mt-2 w-50 br-3 flex flex-col gap-1 uppercase">
        <div className="flex justify-between">
          <h1 className="text-md">Account Number</h1>
          <h1 className="text-md">{user?._id}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">Balance</h1>
          <h1 className="text-md">N{user?.balance}</h1>
        </div>
      </div>

      <div className="home-card card p-2 mt-2 w-50 br-3 flex flex-col gap-1 uppercase">
        <div className="flex justify-between">
          <h1 className="text-md">First Name</h1>
          <h1 className="text-md">{user?.firstName}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">Last Name</h1>
          <h1 className="text-md">{user?.lastName}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">Email</h1>
          <h1 className="text-md">{user?.email}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">Mobile</h1>
          <h1 className="text-md">{user?.mobile}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">Identification Type</h1>
          <h1 className="text-md">{user?.identityType}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">Identification Number</h1>
          <h1 className="text-md">{user?.identityNumber}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">User status</h1>
          <h1 className="text-md">
            {user?.isVerified ? "Verified" : "Not verified"}
          </h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-md">User type</h1>
          <h1 className="text-md">{user?.isAdmin ? "Admin" : "Normal User"}</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
