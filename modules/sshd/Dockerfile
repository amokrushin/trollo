FROM sickp/alpine-sshd:7.5

RUN passwd -d root

ADD trollo-service-account.pub /root/.ssh/authorized_keys
