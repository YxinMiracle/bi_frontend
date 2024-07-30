import {getChartByAsyncUsingPost, getChartUsingPost} from '@/services/backend/chartController';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, message, Select, Space, Upload} from 'antd';
import {useForm} from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import React, {useState} from 'react';

/**
 * 添加图表界面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = useForm();

  const onFinish = async (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await getChartByAsyncUsingPost(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我得图表页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('JSON解析失败失败');
    }
    setLoading(false);
  };

  return (
    <div className="add-chart-async">
      <Card title="智能分析">
        <Form
          name="addChart"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          form={form}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '请输入你的分析目标' }]}
          >
            <TextArea placeholder="请输入你的分析目标 比如：分析网站用户的增长情况" />
          </Form.Item>

          <Form.Item
            name="name"
            label="图表名称"
            rules={[{ required: true, message: '请输入你的图表名称' }]}
          >
            <Input placeholder="请输入你的图表名称" />
          </Form.Item>

          <Form.Item
            name="chartType"
            label="图表类型"
            rules={[{ required: true, message: 'Please select your country!' }]}
          >
            <Select
              options={[
                {
                  value: '折线图',
                  label: '折线图',
                },
                {
                  value: '柱状图',
                  label: '柱状图',
                },
                {
                  value: '堆叠图',
                  label: '堆叠图',
                },
                {
                  value: '饼图',
                  label: '饼图',
                },
                {
                  value: '雷达图',
                  label: '雷达图',
                },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传Excel文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
