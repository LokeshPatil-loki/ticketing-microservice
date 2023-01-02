import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>{currentUser ? "You are signed in" : "You are signed out"}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  console.log("Landing Page");
  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
