# Unikorn-UI

![Unikorn Logo](https://raw.githubusercontent.com/unikorn-cloud/assets/main/images/logos/light-on-dark/logo.svg#gh-dark-mode-only)
![Unikorn Logo](https://raw.githubusercontent.com/unikorn-cloud/assets/main/images/logos/dark-on-light/logo.svg#gh-light-mode-only)

## Overview

This is a user-friendly user interface built on top of [Unikorn](https://github.com/spjmurray/unikorn) server.

## Installing

Install using your method of choice:

<details>
<summary>Helm</summary>

```shell
helm repo add unikorn-ui https::/unikorn-cloud.github.io/ui
helm install unikorn-ui unikorn-ui/ui --namespace unikorn --create-namespace
```

</details>

<details>
<summary>ArgoCD</summary>

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: unikorn-ui
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://unikorn-cloud.github.io/ui
    chart: ui
    targetRevision: v0.1.0
    helm:
      parameters:
        - name: dockerConfig
          value: # output of "base64 -w0 ~/.docker/config.json"
  destination:
    namespace: unikorn
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

</details>

## Building the Container

```shell
make image
```

## Development

### Installing

Install a modern version of Node.js and add the `/bin` directory to your path.

### Linting

```shell
npm run lint
```

### Code Formatting

```shell
npm run format
```
