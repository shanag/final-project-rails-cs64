source 'http://rubygems.org'

gem 'rails', '3.2.0'

gem 'pg', '0.12.2'
gem 'inherited_resources', '1.3.0'
gem 'thin', '1.3.1'
gem 'haml-rails', '0.3.4'
gem 'jquery-rails', '1.0.19'
gem 'kaminari', '~> 0.13.0'
gem 'rabl', '~> 0.5.4'
gem 'grape', :git => "git://github.com/intridea/grape.git", :branch => "frontier" 
gem 'grape-rabl', '~> 0.0.4'
gem 'simple_form', '1.5.2'

# Gems used only in rake tasks.
# Will not be auto-required.
group :tasks do
  gem 'httparty', '0.8.1'
  gem 'typhoeus', '0.3.3'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'coffee-rails', '~> 3.2.1'
  gem 'sass-rails',   '~> 3.2.5'
  gem 'uglifier', '>= 1.0.3'
  gem 'compass-rails', '1.0.0'
  gem 'ruby-haml-js', '0.0.2'
end

group :development, :test do
  gem 'heroku', '2.18.0'
  gem 'pry'
  gem 'pry-nav'
  gem 'pry-stack_explorer'
  gem 'pry-remote'
  gem 'factory_girl_rails', '1.4.0'
  gem 'rspec-rails', '2.8.1'
end

group :test do
  gem 'launchy', '2.0.5'
  gem 'database_cleaner', '0.7.0'
  gem 'capybara', '1.1.2'
  gem 'shoulda-matchers', '1.0.0'
  gem 'capybara-webkit', '0.7.2'
  gem 'jasmine', '1.1.2'
  gem 'email_spec', '1.2.1'
  gem 'therubyracer', '~> 0.9.10', require: false   # takes several seconds to require, so require it only when needed
end

