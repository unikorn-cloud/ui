# UNI UI

## Overview

This is a user-friendly user interface built on top of [UNI](https://github.com/nscaledev/uni)

## Installing

### Prerequisites

First install the [UNI Identity Service](https://github.com/nscaledev/uni/identity) creating an OIDC client for your UI.

Your identity `values.yaml` for Helm should have something similar to this:

```yaml
clients:
  unikorn-ui:
    redirectURI: https://console.unikorn-cloud.org/oauth2/callback
    loginURI: https://console.unikorn-cloud.org/login
    errorURI: https://console.unikorn-cloud.org/error
```

The host names will be used/created later during deployment.
When that has finished deploying, you will need to retrieve your OIDC client ID and secret.

```shell
$ kubectl get oauth2clients.identity.unikorn-cloud.org -A 
NAMESPACE          NAME                                   DISPLAY NAME       REDIRECT URI                                                        SECRET                                        AGE
unikorn-identity   f9f78f4a-e715-4d5c-8f44-f6d0203a0a50   unikorn-ui         https://console.unikorn-cloud.org/oauth2/callback/oauth2/callback   taw7mc-ZTnpNXeSB4wVelpN7bDc9Gk-xPoygkZlkhNU   239d
```

### Deployment

Install using your method of choice:

<details>
<summary>Helm</summary>

Define your `values.yaml`:

```yaml
ui:
  host: console.unikorn-cloud.org
identity:
  host: identity.unikorn-cloud.org
region:
  host: region.unikorn-cloud.org
kubernetes:
  host: kubernetes.unikorn-cloud.org
compute:
  host: compute.unikorn-cloud.org
oauth2:
  clientID: f9f78f4a-e715-4d5c-8f44-f6d0203a0a50
  clientSecret: taw7mc-ZTnpNXeSB4wVelpN7bDc9Gk-xPoygkZlkhNU
ingress:
  externalDns: true
```

```shell
helm repo add unikorn-ui https::/unikorn-cloud.github.io/ui
helm install unikorn-ui unikorn-ui/ui --namespace unikorn --create-namespace -f values.yaml
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
      - name: ui.host
        value: console.unikorn-cloud.org
      - name: identity.host
        value: identity.unikorn-cloud.org
      - name: region.host
        value: region.unikorn-cloud.org
      - name: kubernetes.host
        value: kubernetes.unikorn-cloud.org
      - name: compute.host
        value: compute.unikorn-cloud.org
      - name: oauth2.clientID
        value: f9f78f4a-e715-4d5c-8f44-f6d0203a0a50
      - name: oauth2.clientSecret
        value: taw7mc-ZTnpNXeSB4wVelpN7bDc9Gk-xPoygkZlkhNU
      - name: ingress.externalDns
        value: 'true'
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
