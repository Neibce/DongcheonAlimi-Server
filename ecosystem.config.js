module.exports = {
  apps: [{
		name: 'DcAlimi-REST',
		script: './main.js',
		watch: true,
		
		env: {
			"NODE_ENV": "development" // 개발환경시 적용될 설정 지정
		},
		env_production: {
			"NODE_ENV": "production" // 배포환경시 적용될 설정 지정
		},

		instances: 0,
		exec_mode: 'cluster',
		error_file: '../logs/DongcheonAlimi/err.log',
		out_file: '../logs/DongcheonAlimi/out.log',
		log_file: '../logs/DongcheonAlimi/combined.log',
		time: true
  }]
}