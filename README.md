# Cloud Observability Framework: Autoscaling and Elasticity

Monitor the health of your AWS Auto Scaling groups

## Open Source License

This project is distributed under the [Apache 2 license](./LICENSE).

## What do you need to make this work?

New Relic Infrastructure deployed on your AWS instances.

## Configuration

Open nerdlets/cas-drilldown-nerdlet/index.js with your favorite text editor and modify the two instances of the account ID (2246998) to match your own New Relic account ID.  

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# this is to create a new uuid for the nerdpack so that you can deploy it to your account
nr1 nerdpack:uuid -g [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR SUPPORT, although you can report issues and contribute to the project here on GitHub.

_Please do not report issues with this software to New Relic Global Technical Support._
