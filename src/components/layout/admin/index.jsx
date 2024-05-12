import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { BsPersonVcard } from "react-icons/bs";
import { PiStudentBold } from "react-icons/pi";
import { IoSunny } from "react-icons/io5";
import { IoMdMoon } from "react-icons/io";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaPeopleRoof } from "react-icons/fa6";

import { Button, Flex, Layout, Menu, theme } from "antd";
import {
  DashboardTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Image } from "antd";

import "./index.scss";

const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState("/admin/dashboard");
  const [mode, setMode] = useState(false);
  const { pathname } = useLocation();
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  const { id } = useParams();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const changeMode = () => {
    setMode(!mode);
  };

  useEffect(() => {
    const loadingDuration = 1000; // 2s

    setTimeout(() => {
      setLoadingPage(false);
    }, loadingDuration);
  }, []);

  return (
    <Fragment>
      <div className={loadingPage ? "ring-content" : "ring-content none"}>
        <div className="ring">
          Loading
          <span></span>
        </div>
      </div>
      <Layout className={mode ? "mode" : ""}>
        <Sider
          trigger={null}
          collapsible
          className="aside"
          collapsed={collapsed}
        >
          <Menu
            theme="dark"
            mode="inline"
            style={{ marginTop: "6px", paddingBottom: "10px" }}
            selectedKeys={[key]}
            items={[
              {
                key: "/admin",
                icon: (
                  <Image
                    width={40}
                    height={40}
                    style={{ borderRadius: "50px", marginLeft: "-10px" }}
                    src="https://media.licdn.com/dms/image/D5603AQG9ZVhNoSk1xA/profile-displayphoto-shrink_400_400/0/1705514710802?e=1720051200&v=beta&t=r4rdZUOH7bwg4JbO8bRyv1XLk_FOGHeh0KxG_s15TLQ"
                  />
                ),
                label: (
                  <Flex
                    align="center"
                    gap={20}
                    style={{
                      fontSize: "30px",
                      color: "white",
                    }}
                  >
                    {" "}
                    <span
                      style={{
                        position: "absolute",
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50px",
                        backgroundColor: "#52c41a",
                        top: "28px",
                        left: "25%",
                        boxShadow: "0px 0px 10px  3px green",
                      }}
                    ></span>
                    Admin
                  </Flex>
                ),
              },
              {
                key: "/admin/dashboard",
                icon: <DashboardTwoTone />,
                label: <Link to="/admin/dashboard">Dashboard</Link>,
              },
              {
                key: "/admin/teachers",
                icon: <BsPersonVcard />,
                label: <Link to="/admin/teachers">Teachers</Link>,
              },
              // {
              //   key: "/admin/hook",
              //   icon: <PiStudentBold />              ,
              //   label: <Link to="/admin/hook">TeachersHook</Link>,
              // },
              {
                key: "/admin/students",
                icon: <FaPeopleRoof />,
                label: <Link to="/admin/students">Students</Link>,
              },
              {
                key: `/admin/student`,
                icon: <PiStudentBold />,
                label: (
                  <Link to="/admin/teachers/teacher/teacherId/student">
                    Student
                  </Link>
                ),
              },
              {
                key: "",
                icon: <UploadOutlined />,
                label: <Link to="/">Logout</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              className="toggle-btn"
              type="text"
              icon={
                collapsed ? (
                  <AiOutlineMenuUnfold color={mode ? "white" : ""} />
                ) : (
                  <AiOutlineMenuFold color={mode ? "white" : ""} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <button
              style={{
                marginRight: "20px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                marginTop: "10px",
              }}
              onClick={changeMode}
            >
              {mode ? (
                <IoSunny color="yellow" fontSize={"24px"} />
              ) : (
                <IoMdMoon fontSize={"24px"} />
              )}
            </button>
          </Header>
          <Content
            className="content"
            style={{
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
};
export default App;
