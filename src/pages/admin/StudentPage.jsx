import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import request from "../../server/request";
import useFetchPagination from "../../hook/useFetchPagination";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Flex, Form, Image, Input, Modal, Pagination, Select, Space, Table } from "antd";
import { DeleteTwoTone, EditTwoTone, UserAddOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";
import Loading from "../../components/loading";

// const StudentPage = () => {
//   const {id} = useParams();
//   const [data , setData] = useState(null);
//   const [loading , setLoading] = useState(false)



//   useEffect(() => {
//     const getStudent = async () => {
//         try{
//             setLoading(true)
//             const {data} = await request(`teacher/${id}/student`)
//             console.log(data);
//             setData(data)
//         }
//         finally{
//             setLoading(false)
//         }
//     }
//     getStudent();
//   } , [id])
//   return (
//     <div>{data?.length}</div>
//   )
// }

const StudentPage = () => {
  const {id: teacherId} = useParams();
  console.log(teacherId);

  const [search , setSearch] = useState('');
  const [filter , setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const {data:teacherData , loading , btnLoading ,refetch ,setBtnLoading , setIsModalOpen , total , page , handlePage , isModalOpen } = useFetchPagination({url:search ? `teacher/${teacherId}/student?firstName=${search}` : `teacher/${teacherId}/student` })
  console.log(filter);
  let teachers = teacherData;
  const [form] = useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setBtnLoading(true);
      if (selected === null) {
        await request.post( `teacher/${teacherId}/student`, values);
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
    setSelected(id);
    const { data } = await request(`teacher/${teacherId}/student/${id}`);
    console.log(id);
   form.setFieldsValue(data);
  };

  const deleteTeacher =  async(id) => {
    const checkDelete = window.confirm()
    if(checkDelete){
      await request.delete(`teacher/${teacherId}/student/${id}`)
      refetch()
    }
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
        </Fragment>
      ),
    },
  ];

  return (
      <Fragment>
      {teachers ? 
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
      /> : <Loading width="100%" /> }
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
            name="lastName"
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

export default StudentPage