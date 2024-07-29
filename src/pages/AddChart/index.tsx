import { getChartUsingPost } from '@/services/backend/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

/**
 * 添加图表界面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<any>();

  const onFinish = async (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    setOption(undefined);
    setChart(undefined);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await getChartUsingPost(params, {}, values.file.file.originFileObj);
      setChart(res.data);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('分析代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('JSON解析失败失败');
    }
    setLoading(false);
  };

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              name="addChart"
              labelAlign="left"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={onFinish}
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
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请现在左侧进行提交</div>}
            <Spin spinning={loading} />
          </Card>
          <Divider />
          <Card title="可视化图表">
            {option ? <ReactECharts option={option} /> : <div>请现在左侧进行提交</div>}
            <Spin spinning={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
