### Configuration

---

#### Prerequisites

---

- Git
- Docker
- Docker Compose
- Make

---

#### Environment variable

---

```
echo $SHELL = /bin/bash || /bin/zsh

vim ~/.bashrc || vim ~/.zshrc

export RASA_DIR=/home/aleksandarrakic/Desktop/rasa-bank-chatbot
alias rbc='gmake -C $RASA_DIR/docker'
source ~/.bashrc || source ~/.zshrc
```

---

#### Setup project

---

- `rbc help` - Display all available commands.
- `rbc setup h=1` - Initialize the application environment.
- `rbc exec c=php` - Open a shell session in a specified container.
- `rbc logs c=php` - Display logs for a specific container.