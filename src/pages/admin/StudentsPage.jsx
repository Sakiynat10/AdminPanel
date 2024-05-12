
// import { Button, Result } from 'antd';
// import { Link } from 'react-router-dom';

// const StudentsPage = () => (
//   <Result
//     status="404"
//     title="404"
//     subTitle="Sorry, the page you visited does not exist information."
//     extra={<Link to={"/admin/dashboard"} type="primary" >Back Home</Link>}
//   />
  
// );
// export default StudentsPage;

import { Fragment, useEffect, useState } from "react";
import request from "../../server/request";
import {
  Button,
  Flex,
  Image,
  Form,
  Modal,
  Pagination,
  Table,
  Typography,
  Input,
  Checkbox,
  Select,
  Space,
} from "antd";
import { DeleteTwoTone, EditTwoTone, UserAddOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;
const { useForm } = Form;
const { confirm } = Modal;

const TeachersPage = () => {
  const [teachers, setTeachers] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callback, setCallBack] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const {teacherId} = useParams();
  console.log(teacherId);

  const [form] = useForm();

  useEffect(() => {
    const getTeachers = async () => {
      try {
        setLoading(true);
        const params = { page, limit: 10, search };
        const { data } = await request(
          filter ? `student?isWork=${filter}` : "student",
          { params }
        );
        // const {data} = await request(search ? `teacher?search=${search}` : "teacher", { params });
        const { data: totalData } = await request(
          filter ? `student?isWork=${filter}` : "student"
        );
        setTotal(totalData.length);
        setTeachers(data);
      } finally {
        setLoading(false);
      }
    };
    getTeachers();
  }, [page, callback, search, filter]);

  const refetch = () => {
    setCallBack(!callback);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelected(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setBtnLoading(true);
      if (selected === null) {
        await request.post(`teacher/${teacherId}/student`, values);
      } else {
        await request.put(`teacher/${teacherId}/student/${selected}`, values);
      }
      setIsModalOpen(false);
      refetch();
    } finally {
      setBtnLoading(false);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const editTeacher = async (id) => {
    setIsModalOpen(true);
    setSelected(teacherId);
    const { data } = await request(`teacher/${teacherId}/student/${id}`);
    form.setFieldsValue(data);
  };

  const deleteTeacher = async (id) => {
    confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Yes",
      cancelText: "No",
      confirmLoading: btnLoading,
      onOk: async () => {
        try {
          setBtnLoading(true);
          setSelected(id)
          await request.delete(`teacher/${teacherId}/student/${id}`);
          refetch();
        } finally {
          setBtnLoading(false);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  /*Searching */
  const handleChange = (value) => {
    console.log(`${value}`);
    setFilter(`${value}`);
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => (
        <Image width={50} height={50} className="teacher-img" src={text} />
      ),
    },
    {
      title: "Firstname",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Lastname",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Birth date",
      dataIndex: "birthday",
      key: "birthday" ,
      render: (text) => (<p>{text.split("T")[0]}</p>)
    },
    {
      title: "Tuition fee",
      dataIndex: "fee",
      key: "fee",
      render: (text) => (<p>${text * 1000}</p>)
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Is Work?",
      dataIndex: "isWork",
      key: "isWork",
      render: (text) => (text ? "Work" : "Jobless"),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id) => (
        <Fragment>
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => editTeacher(id)}
          >
            <EditTwoTone />
          </Button>
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => deleteTeacher(id)}
          >
            <DeleteTwoTone />
          </Button>
          <Link to={`teacher/${id}/student`}>See Students</Link>
        </Fragment>
      ),
    },
  ];

  return (
    <Fragment>
      <Table
        className="table-teacher"
        pagination={false}
        title={() => (
          <Flex align="center" gap={20} justify="space-between">
            <Title style={{ width: "30%" }} level={3}>
              Students {total}
            </Title>
            <Input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Search teachers..."
            />
            <Space wrap>
              <Select
                defaultValue="All"
                style={{
                  width: 120,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "",
                    label: "All",
                  },
                  {
                    value: "true",
                    label: "Married",
                  },
                  {
                    value: "false",
                    label: "Single",
                  },
                ]}
              />
            </Space>
            <Button onClick={showModal}>
              <UserAddOutlined />
            </Button>
          </Flex>
        )}
        dataSource={teachers}
        columns={columns}
      />
      {total <= 10 ? (
        ""
      ) : (
        <Pagination
          total={total}
          current={page}
          onChange={handlePage}
        />
      )}
      <Modal
        title="Teacher Data"
        confirmLoading={btnLoading}
        open={isModalOpen}
        onOk={handleOk}
        okText={selected === null ? "Add" : "Save"}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="teacher"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            display:"grid" ,
            gridTemplateColumns:"1fr  1fr" ,
            gap:"20px" ,
            maxWidth: 800,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Avatar Url:"
            name="avatar"
            rules={[
              {
                required: true,
                message: "Please input your avatar!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="First Name:"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your First Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastNmae"
            rules={[
              {
                required: true,
                message: "Please input your Last Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your Phone Number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="BirthDate"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Please input your BirthDate!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tuition fee"
            name="fee"
            rules={[
              {
                required: true,
                message: "Please input your Tuition fee!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Rating"
            name="rating"
            rules={[
              {
                required: true,
                message: "Please input your rating!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{marginTop:"40px"}}
            name="isWork"
            valuePropName="checked"
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <Checkbox>Is Work?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersPage;

