require 'rack'

class Rack::Apocalypse404
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)

    if status.to_i > 400        
      puts " -- #{status} -- Redirecting to apocalyptic message...."

      spec = Gem::Specification.find_by_name("apocalypse-404")
      filename = File.join( spec.gem_dir, 'lib', 'html' ) + "/404.html"
      response = [File.read( filename ).gsub!(/!!MESSAGE/, status.to_s )]

      headers = { "Content-Length" => response[0].length.to_s, 
                  "Content-Type" => 'text/html;charset=utf-8' }
    end

    [ status, headers, response ]
  end
end