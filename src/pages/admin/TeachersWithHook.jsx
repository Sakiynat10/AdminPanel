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
import {
  DeleteTwoTone,
  EditTwoTone,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchPagination from "../../hook/useFetchPagination";



const { Title } = Typography;
const { useForm } = Form;
const { confirm } = Modal;



const TeachersHookPage = () => {
  const [search , setSearch] = useState('');
  const [filter , setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const {data:teacherData , loading , btnLoading ,refetch ,setBtnLoading , setIsModalOpen , total , page , handlePage , isModalOpen } = useFetchPagination({url: search ? `teacher?firstName=${search}` : "teacher" })
  console.log(teacherData?.filter((data) => data.isMarried === filter));
  console.log(teacherData?.[0].isMarried);
  console.log(filter);
  let teachers = teacherData;
  const [form] = useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setBtnLoading(true);
      if (selected === null) {
        await request.post( "teacher", values);
      } else {
        await request.put(`teacher/${selected}`, values);
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
    setSelected(id);
    const { data } = await request(`teacher/${id}`);
    form.setFieldsValue(data);
  };

  const deleteTeacher = async (id) => {
    confirm({
      title: "Are you sure you want to delete this teacher?",
      okText: "Yes",
      cancelText: "No",
      confirmLoading: btnLoading,
      onOk: async () => {
        try {
          setBtnLoading(true);
          await request.delete(`teacher/${id}`);
          refetch();
        } finally {
          setBtnLoading(false);
        }
      },
    });
  };

  /*Searching */
const handleSearch = (e) => {
    setSearch(e.target.value)
  }

const handleChange = (value) => {
  console.log(`${value}`);
  setFilter(`${value}`)
};

const showModal = () => {
  setIsModalOpen(true);
  form.resetFields();
  setSelected(null);
};

console.log(total);



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
      dataIndex: "lastNmae",
      key: "lastNmae",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Is Married?",
      dataIndex: "isMarried",
      key: "isMarried",
      render: (text) => (text ? "Married" : "Single"),
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
        pagination={false}
        title={() => (
          <Flex align="center" gap={20} justify="space-between">
            <Title style={{width:"30%"}} level={3}>Teachers {total}</Title>
            <Input value={search} onChange={handleSearch} type="text" placeholder="Search teachers..." />
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
                    value: true,
                    label: "Married",
                  },
                  {
                    value: false,
                    label: "Single",
                  }
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
      {total <= 10 ? "" : <Pagination total={total} current={page} onChange={handlePage} />}
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
            maxWidth: 600,
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
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: "Please input your Age!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isMarried"
            valuePropName="checked"
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <Checkbox>Is Married?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersHookPage;
