import {Flex, Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./login.scss";


const LoginPage = () => {
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (values) => {
    console.log('login-data:', values);
    try{
      setLoading(true)
      await axios.post("https://reqres.in/api/login", values)
      navigate('admin/dashboard')
    }finally{
      setLoading(false)
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Flex className="login-page">
      <h1>LoginPage</h1>
      <Form
      className='input-group'
        name="login"
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
        onFinish={login}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input className='input' />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password className='input' />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item 
        className='login-btn'
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
