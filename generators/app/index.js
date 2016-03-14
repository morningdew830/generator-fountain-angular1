'use strict';

const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting: {
    fountain() {
      this.options.framework = 'angular1';
      this.fountainPrompting();
    },

    sample() {
      const done = this.async();

      this.option('sample', {type: Boolean, required: false});

      const prompts = [{
        when: !this.options.sample,
        type: 'list',
        name: 'sample',
        message: 'Do you want a sample app?',
        choices: [
          {name: 'A working landing page', value: 'techs'},
          {name: 'Just a Hello World', value: 'hello'}
        ]
      }];

      this.prompt(prompts, props => {
        Object.assign(this.props, this.options, props);
        done();
      });
    }
  },

  configuring() {
    this.mergeJson('package.json', {
      dependencies: {
        angular: '^1.5.0'
      },
      devDependencies: {
        'angular-mocks': '^1.5.0',
        'gulp-angular-templatecache': '^1.8.0'
      }
    });
  },

  composing() {
    this.composeWith(`fountain-angular1:${this.props.sample}`, {options: this.props}, {
      local: require.resolve(`../${this.props.sample}`)
    });
    this.composeWith('fountain-gulp', {options: this.props}, {
      local: require.resolve('generator-fountain-gulp/generators/app')
    });
  },

  writing() {
    this.copyTemplate('src/index.html', 'src/index.html');
  }
});