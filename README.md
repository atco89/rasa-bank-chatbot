### **RASA BANK CHATBOT**

This document provides all the necessary steps to set up and run the RASA Bank Chatbot project.

---

### Prerequisites:

- **Git**
- **Docker**
- **Docker Compose**
- **Make**

---

### Pre-Setup Configuration

Before using the makefile, execute the following commands in your terminal:

```
echo $SHELL = /bin/bash

vim ~/.bashrc

# Add the following lines to your ~/.bashrc file:
export RBC_DIR=/home/aleksandarrakic/Desktop/rasa-bank-chatbot
alias rbc='gmake -C $RBC_DIR/docker'

# Reload your bash configuration:
source ~/.bashrc
```

To see all available commands, run:

``` 
rbc help 
```

To begin the installation, execute:

```
rbc setup h=1
```

---
> PLEASE BE AWARE THAT THE COMMAND `rbc setup h=1` WILL REMOVE ALL EXISTING CONTAINERS, VOLUMES, DATABASES, AND GENERATED
> FILES.
---

After installation, bundle the JavaScript files with:

```
rbc exec c=node
```

Then, inside the node container, run:

```
npm ci && npm run dev
```

Upon a successful installation, you can access the following services:

- Agent: [https://localhost](https://localhost)
- Adminer: [https://adminer.localhost](https://adminer.localhost)
- RASA PRO Server: [https://chat.localhost](https://chat.localhost)
- RASA Actions Server: [https://actions.localhost](https://actions.localhost)

---
> Because the certificates are self-signed, you must accept the certificate when accessing the subdomain [https://chat.localhost](https://chat.localhost).
---

**Developed and maintained by Aleksandar Rakić**

- **[Email](mailto:aleksandar.rakic@yahoo.com)**
- **[LinkedIn](https://www.linkedin.com/in/rakic-aleksandar)**
- **[GitHub](https://github.com/atco89)**
- **[Kaggle](https://www.kaggle.com/aleksandarraki)**
- **[ResearchGate](https://www.researchgate.net/profile/Aleksandar-Rakic-7)**
