require 'rack'

class Rack::Apocalypse404
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)

    if headers["Content-Type"].downcase.include?('text/html') && (status == 404 || status == 500)
      puts " -- #{status} -- Redirecting to apocalyptic message...."

      t = "#{Gem.dir}/gems/#{Apocalypse404::NAME}-#{Apocalypse404::VERSION}/lib"
      filename = File.join( t, 'html' ) + "/404.html"
      response = [File.read( filename ).gsub!(/!!MESSAGE/, status.to_s )]

      headers = { "Content-Length" => response[0].length.to_s, 
                  "Content-Type" => 'text/html;charset=utf-8' }
    end

    [ status, headers, response ]
  end
end

#t = ["#{File.dirname(File.expand_path($0))}/../lib/#{Apocalypse404::NAME}",
#     "#{Gem.dir}/gems/#{Apocalypse404::NAME}-#{Apocalypse404::VERSION}/lib/#{Apocalypse404::NAME}"]
#f = t.each {|i| return i if File.readable?(i) }
