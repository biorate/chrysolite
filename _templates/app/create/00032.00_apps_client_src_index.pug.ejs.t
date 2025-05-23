---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/index.pug`) %>
unless_exists: true
---
doctype html
html(lang='en')
    head
        title <%= APP_NAME %>
        base(href='/')
        meta(charset='utf-8')
        meta(name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
        link(rel='stylesheet' href='style.css')
    body
        #root
        script(src='index.js')
