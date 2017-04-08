VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.network "forwarded_port", guest: 9000, host: 9000

  config.vm.provision :docker
  config.vm.provision :docker_compose, yml: "/vagrant/docker-compose.yml", rebuild: true, run: "always"

  #allows you to run docker-compose commands from anywhere
  config.vm.provision "shell", inline: "echo \"export COMPOSE_FILE='/vagrant/docker-compose.yml'\" >> /home/vagrant/.bash_profile"

end
