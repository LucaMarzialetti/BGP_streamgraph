#!/bin/sh

# Set your directories here:
css_location='dev/view/css/'
css_dist_location='dev/view/css/'
deployment_dir='/Users/mcandela/Documents/work/git-workspace/RIPEstat/static/js/interdomain-landscape/'

rm ${css_dist_location}style-lib-dist.min.css
rm ${css_dist_location}style-lib-dist.css
lessc ${css_location}style-compiled.less ${css_dist_location}style-compiled.tmp.less
lessc ${css_dist_location}style-compiled.tmp.less ${css_dist_location}style-lib-dist.css
rm ${css_dist_location}style-compiled.tmp.less
minify -o ${css_dist_location}style-lib-dist.min.css ${css_dist_location}style-lib-dist.css


r.js -o app.build.2.js
uglifyjs bgpst-dist.js -o bgpst-dist.js

cp -fR * ${deployment_dir}
rm ${deployment_dir}*html
rm ${deployment_dir}*htm
rm ${deployment_dir}*txt
rm ${deployment_dir}*php
rm ${deployment_dir}*sh
