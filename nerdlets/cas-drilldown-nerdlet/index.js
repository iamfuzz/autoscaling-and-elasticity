import React, { Component } from 'react';
import { NrqlQuery, BlockText, LineChart, List, ListItem, Card, CardHeader, CardBody } from 'nr1'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      splash: false,
      account: 2246998,
    };
  }

  componentDidMount() {
    NrqlQuery.query({accountId: 2246998, query: "FROM AutoScalingGroupSample SELECT uniques(displayName) FACET provider.launchConfiguration",formatType: NrqlQuery.FORMAT_TYPE.RAW}).then(({ data }) => { 
	//add brackets ({data}) for just data, remove them for seeing errors
	//console.log(JSON.stringify(data));
	this.setState({ items: data.raw.facets })}).catch(error => {
      		console.log(error);
    	});
  }

  render() {
      const { items } = this.state;
      var { account } = this.state;

      const style = {
          width: "31.33%",
          height: 300,
	  float: "left",
      };
  
      return (
          <div>
	  <div>
		<img style={{height: 150, float: 'left', margin: '15px'}} src="https://upload.wikimedia.org/wikipedia/commons/d/dd/AWS_Simple_Icons_Compute_Amazon_Elastic_MapReduce_Auto_Scaling.svg"/>
		<BlockText style={{height: 150, float: 'left', margin: '15px'}} type={BlockText.TYPE.PARAGRAPH}>
			Auto Scaling helps you maintain application availability and allows you to dynamically scale your Amazon EC2 capacity up or down automatically according to conditions you define. You can use Auto Scaling for Fleet Management of EC2 instances to help maintain the health and availability of your fleet and ensure that you are running your desired number of Amazon EC2 instances. You can also use Auto Scaling for Dynamic Scaling of EC2 instances in order to automatically increase the number of Amazon EC2 instances during demand spikes to maintain performance and decrease capacity during lulls to reduce costs. The two charts to the right show the current overall state and count of the EC2 instances in your fleet.
		</BlockText>
</div>
		<LineChart
			accountId={account}
			query="SELECT max(`provider.groupInServiceInstances.Maximum`) as InService, max(`provider.groupTerminatingInstances.Maximum`) as Terminated, max(`provider.groupPendingInstances.Maximum`) as Pending, max(`provider.groupStandbyInstances.Maximum`) as StandBy  FROM AutoScalingGroupSample UNTIL 10 minutes ago TIMESERIES auto"
			style={{float: 'left', margin: '15px', width: '400px'}}
		/>
		<LineChart
			accountId={account}
			query="SELECT max(`provider.groupDesiredCapacity.Maximum`) as Desired, max(`provider.groupMaxSize.Maximum`) as Maximum, max(`provider.groupMinSize.Minimum`) as Minimum FROM AutoScalingGroupSample WHERE provider = 'AutoScalingGroup' UNTIL 10 minutes ago TIMESERIES auto"
			style={{float: 'left', margin: '15px', width: '400px'}}
		/>
		<img style={{height: 150, float: 'left', margin: '15px'}} src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Health_pictogram.png"/>
		<BlockText style={{height: 400, width: '100%', float: 'left', margin: '15px'}} type={BlockText.TYPE.PARAGRAPH}>
			AWS outlines best practices around Auto Scaling highlighting 3 areas of focus:
			<List>
				<ListItem>&nbsp;</ListItem>
            			<ListItem><b>Enable Auto Scaling group metrics:</b> To enable Auto Scaling group metrics, open an Auto Scaling group in the Amazon EC2 console, and from the <b>Monitoring</b> tab, choose <b>Enable Group Metrics Collection</b>. These metrics describe the group rather than any of its instances. </ListItem>
				<ListItem>&nbsp;</ListItem>
            			<ListItem><b>Check which instance type your Auto Scaling group uses:</b> Many users choose T2 and T3 burstable instances due to their low cost.  Where possible, use standard instances.  If T type instances are needed, configure the instances as <b>unlimited</b> which will prevent the instances from exceeding their burst thresholds and limiting performance.  T3 instances are launched as <b>unlimited</b> by default.</ListItem>
				<ListItem>&nbsp;</ListItem>
            			<ListItem><b>Enable detailed monotoring for your EC2 instances:</b> Wherever possible, you should scale on Amazon EC2 instance metrics with a 1-minute frequency because that ensures a faster response to utilization changes. Scaling on metrics with a 5-minute frequency can result in a slower response time and scaling on stale metric data. <b>There is no health check around EC2 monitoring in this application.</b> Please see <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-instance-monitoring.html#enable-as-instance-metrics" target="_blank">Configure Monitoring for Auto Scaling Instances</a> in the Amazon EC2 Auto Scaling User Guide.</ListItem>
        		</List>
		</BlockText>
		<BlockText style={{height: 400, width: '100%', float: 'left', margin: '15px'}} type={BlockText.TYPE.PARAGRAPH}>
			Below is a list of all Auto Scaling groups in your AWS environment.  Based on the AWS best practices detailed on the left, some health checks are performed on each group to determine if these best practices are being followed.  Those health checks are:
			<List>
				<ListItem>&nbsp;</ListItem>
            			<ListItem><b>Monitoring:</b> This health check determines if Auto Scaling group metrics is enabled for your Auto Scaling group.</ListItem>
				<ListItem>&nbsp;</ListItem>
            			<ListItem><b>Instance Count:</b> This health check determines whether the instance count in your Auto Scaling group is at, above, or below the desired level. <b>This data will not be present for Auto Scaling groups without group metrics enabled.</b></ListItem>
				<ListItem>&nbsp;</ListItem>
            			<ListItem><b>Burstability:</b> This health check details the instance type utilized by your Auto Scaling group.</ListItem>
				<ListItem>&nbsp;</ListItem>
        		</List>
		</BlockText>
        	{items.map(item =>
			<Card style={style} spacingType={[Card.SPACING_TYPE.LARGE]}>
				<CardHeader title={item.results[0].members[0]}/>
				<CardBody>
					<NrqlQuery accountId={account} query={"FROM AutoScalingGroupSample SELECT latest(provider.groupTotalInstances.Sum) as count, latest(provider.groupDesiredCapacity.Minimum) as desired WHERE entityName='" + item.results[0].members[0] + "'"}>
					    {({ data }) => {
					        if (data) {
							if (data[0].data[0].count !== null) {
								if (data[0].data[0].count == 0) {
									return <div><h3><b>Monitoring:</b> <font color="green">ASG Group Metrics Enabled</font></h3><h3><b>Instance Count:</b> <font color="red">0 Active Instances in Group</font></h3></div>
								}
								else if (data[0].data[0].count < data[1].data[0].desired) {
									return <div><h3><b>Monitoring:</b> <font color="green">ASG Group Metrics Enabled</font></h3><h3><b>Instance Count:</b> <font color="orange">Instance Count Below Desired Level</font></h3></div>
								}
								else if (data[0].data[0].count == data[1].data[0].desired) {
									return <div><h3><b>Monitoring:</b> <font color="green">ASG Group Metrics Enabled</font></h3><h3><b>Instance Count:</b> <font color="green">Instance Count At Desired Level</font></h3></div>
								}
								else if (data[0].data[0].count > data[1].data[0].desired) {
								return <div><h3><b>Monitoring:</b> <font color="green">ASG Group Metrics Enabled</font></h3><h3><b>Instance Count:</b> <font color="orange">Instance Count Above Desired Level</font></h3></div>
								}
							}
							else {
								return <h3><b>Monitoring:</b> <font color="red">ASG Group Metrics Disabled</font></h3>
							}
					        }
						else {
					        	return <h3>Loading...</h3>;
						}
					    }}
					</NrqlQuery>
					<NrqlQuery accountId={account} query={"FROM AutoScalingLaunchConfigurationSample SELECT latest(provider.instanceType) as type WHERE displayName='" + item.name + "'"}>
					    {({ data }) => {
					        if (data) {
							console.log(JSON.stringify(data));
							if (data[0].data[0].type.startsWith("t2")) {
								return <h3><b>Burstability:</b> <font color="orange">Group Contains T2 Instances</font></h3>
							}
							else if (data[0].data[0].type.startsWith("t3")) {
								return <h3><b>Burstability:</b> <font color="orange">Group Contains T3 Instances</font></h3>
							}
							else {
								return <h3><b>Burstability:</b> <font color="green">Group Contains Standard Instances</font></h3>
							}
					        }
						else {
					        	return <h3>Loading...</h3>;
						}
					    }}
					</NrqlQuery>
				</CardBody>
			</Card>
        	)}
          </div>
      );
  }
}

export default App;
