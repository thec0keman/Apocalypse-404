require 'rack'

class Rack::Apocalypse404
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)
    type = headers["Content-Type"]
    if !type.nil? && type.downcase.include?('text/html') && (status == 404 || status == 500)
      puts " -- #{status} -- Redirecting to apocalyptic message...."

      spec = Gem::Specification.find_by_name("apocalypse-404")
      filename = File.join( spec.gem_dir, 'lib', 'html' ) + "/404.html"
      unless File.readable(filename)
        puts "HTML file was not found at #{filename}"
        puts "Files in that directory are: " + Dir.foreach( File.join(t, 'html') ).inject("") { |res, v| res += "#{v}\n"}
        response = "Error"
      else
        response = [File.read( filename ).gsub!(/!!MESSAGE/, status.to_s )]
      end

      headers = { "Content-Length" => response[0].length.to_s, 
                  "Content-Type" => 'text/html;charset=utf-8' }
    end

    [ status, headers, response ]
  end
end

#t = ["#{File.dirname(File.expand_path($0))}/../lib/#{Apocalypse404::NAME}",
#     "#{Gem.dir}/gems/#{Apocalypse404::NAME}-#{Apocalypse404::VERSION}/lib/#{Apocalypse404::NAME}"]
#f = t.each {|i| return i if File.readable?(i) }
