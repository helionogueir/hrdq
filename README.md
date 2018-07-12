# Running Database Queries (hrdq)
Running database queries

---
## Summary
1.	Create Application Container (Docker)

---
## 1. Create Application Container (Docker)

### 1.1. Container for Application
Before execute check if container or IP exists!
```bash
$ sudo docker run \
    --memory "128M" \
    --name "hrdq" \
    --volume "${HOME}/workspace/hrdq":"/var/local/application" \
    --tty --interactive node:8.10 /bin/bash
```

### 1.2. Prepare Linux Container
```bash
$ echo "alias ll='ls -alh --color'"
$ echo "alias ll='ls -alh --color'" | tee --append "/root/.bashrc" && alias ll='ls -alh --color'
```

### 1.3. Prepare Application
```bash
$ cd "/var/local/application"
$ npm install
$ npm start
```

---