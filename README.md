# Apocalypse404

Generates an apocalyptic message for any 400/500 responses on your app

## Installation

Add this line to your application's Gemfile:

    gem 'apocalypse404'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install apocalypse404

## Usage

Sinatra:

    require 'apocalypse-404'
    use Rack::Apocalypse404

Rails:

- For Rails 3> simply including the gem should automatically include the middleware for rack
- To manually include it `config.middleware.use Rack::Apocalypse404`

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
