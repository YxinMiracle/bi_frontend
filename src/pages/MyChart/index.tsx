import { listMyChartVoByPageUsingPost } from '@/services/backend/chartController';
import { useModel } from '@umijs/max';
import { Avatar, Card, Divider, List, message, Result } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

/**
 * 添加图表界面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const initSearchParams = {
    current: 1,
    pageSize: 12,
    sortField: 'createTime',
    sortOrder: 'desc'
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartVoByPageUsingPost(searchParams);
      if (res.data) {
        setTotal(res.data.total ?? 0);
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.status === 'succeed'){
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
        setChartList(res.data.records ?? []);
      }
    } catch (e: any) {
      message.error('获取图表内容失败', e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search
          loading={loading}
          placeholder="请输入图表名称"
          enterButton
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        ></Search>
      </div>
      <Divider> </Divider>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 3,
        }}
        loading={loading}
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            setSearchParams({
              ...searchParams,
              current: page,
            });
          },
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total: total,
        }}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser?.userAvatar} />}
                title={<a>{item.name}</a>}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {item.status === 'succeed' && (
                  <>
                    {'分析目标：' + item.goal}
                    <div style={{ marginBottom: 16 }}></div>
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                  </>
                )}
                {item.status === 'failed' && (
                  <Result status="error" title="图表生成错误" subTitle={item.execMessage} />
                )}
                {item.status === 'running' && (
                  <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                )}
                {item.status === 'wait' && (
                  <Result
                    status="warning"
                    title="待生成"
                    subTitle={item.execMessage ?? '当前系统较为繁忙，请稍后尝试'}
                  />
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
