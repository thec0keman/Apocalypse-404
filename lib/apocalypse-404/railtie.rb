module Apocalypse404
  class Railtie < Rails::Railtie
    initializer '404apocalypse.insert_middleware' do |app|
      app.config.middleware.use Rack::Apocalypse404
    end
  end
end