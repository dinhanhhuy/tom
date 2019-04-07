# Tom E-commerce
> Tom the biggest e-commerce of the world.  

Tested ENV
------------
- CentOS Linux 7 (Core), Docker version 18.09.0, docker-compose version 1.18.0
- macOS Mojave 10.14.3, Docker version 18.09.2, docker-compose version 1.23.2

Install docker & docker-compose lasted version
------------
https://www.docker.com/

Start application (Node & MySQL)
------------
(wait a bit, MySQL about reset 3 times at the first run).
```sh
$ ./start.sh
```

Run test
------------
```
$ ./test.sh
```

Advances
------------
#### The flowing config affect to stress test:
* Number CPU of container:  
Number API cluster equal to number CPU of container (`pm2 start -i max`). Each cluster using max ~100% CPU.
* Port mapping (macOS only):  
macOS docker-compose don't support `"network_mode: host"`.  
To use outside tool like ApacheBench (ab) on macOS you need update the below settings and `./start.sh` again.  
    1. Remove `"network_mode"` form `./docker-compose.yml`.
    2. Update `./express/api/config/local.env` setting to `DATABASE_CONNECTION_HOST=host.docker.internal`.
* MySQL data loss:  
This project don't mount MySQL data outside of container. Data maybe loss when restart container.