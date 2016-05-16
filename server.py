import BaseHTTPServer, SimpleHTTPServer
import ssl


httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 5000),
        SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket,
        keyfile="ssl/server.key",
        certfile='ssl/server.crt', server_side=True)

print "The server is running!"
httpd.serve_forever()
