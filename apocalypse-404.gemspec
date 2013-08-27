# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'apocalypse-404/version'

Gem::Specification.new do |spec|
  spec.name          = "apocalypse-404"
  spec.version       = Apocalypse404::VERSION
  spec.authors       = ["John Ratcliff"]
  spec.email         = ["john.w.ratcliff@biola.edu"]
  spec.description   = "404/500, panick!"
  spec.summary       = "404/500 pages for a rack based app"
  spec.homepage      = "http://ratcliffs.info"
  spec.license       = "MIT"

  spec.files         = Dir['README.*', 'MIT-LICENSE', 'lib/**/*.rb', 'lib/html/404.html', 'lib/tasks/*.rake']
  #spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  #spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_dependency "rack"
end
