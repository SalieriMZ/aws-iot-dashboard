# Directorio `certs/`

Este directorio contiene los certificados X.509 para conectarse a **AWS IoT Core** en modo AWS.

> **Importante:** Este directorio está en `.gitignore`. Nunca subas certificados reales a un repositorio público.

## Archivos requeridos (modo AWS)

| Archivo | Descripción | Cómo obtenerlo |
|---|---|---|
| `device-cert.pem` | Certificado del dispositivo (Thing) | Descargado al crear el Thing en AWS Console o via CLI |
| `private-key.pem` | Clave privada del certificado | Descargado junto al certificado (solo disponible una vez) |
| `AmazonRootCA1.pem` | Root CA de Amazon Trust Services | [Descargar desde Amazon](https://www.amazontrust.com/repository/AmazonRootCA1.pem) |

## Cómo obtener los certificados desde AWS Console

1. Abre [AWS IoT Core Console](https://console.aws.amazon.com/iot/)
2. Ve a **Manage > Things > Create things**
3. Selecciona "Create a single thing"
4. Nombra tu Thing (ej: `iot-dashboard-device`)
5. En "Configure device certificate", selecciona **"Auto-generate a new certificate (recommended)"**
6. Descarga todos los archivos:
   - `xxxxx-certificate.pem.crt` → renombrar a `device-cert.pem`
   - `xxxxx-private.pem.key` → renombrar a `private-key.pem`
   - `AmazonRootCA1.pem` → dejar con el mismo nombre
7. Adjunta una **Policy** al certificado (ver ejemplo abajo)
8. Activa el certificado

## Policy de IoT (mínima)

Crea esta policy en AWS IoT > Security > Policies:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Connect",
        "iot:Subscribe",
        "iot:Receive",
        "iot:Publish"
      ],
      "Resource": "arn:aws:iot:REGION:ACCOUNT_ID:*"
    }
  ]
}
```

Reemplaza `REGION` y `ACCOUNT_ID` con tus valores reales.

## Cómo obtener los certificados via AWS CLI

```bash
# Crear certificado y activarlo
aws iot create-keys-and-certificate \
  --set-as-active \
  --certificate-pem-outfile certs/device-cert.pem \
  --public-key-outfile certs/public-key.pem \
  --private-key-outfile certs/private-key.pem

# Descargar Root CA
curl -o certs/AmazonRootCA1.pem \
  https://www.amazontrust.com/repository/AmazonRootCA1.pem
```

## Estructura esperada

```
certs/
├── README.md          ← Este archivo (committeado)
├── device-cert.pem    ← NO commitear
├── private-key.pem    ← NO commitear
└── AmazonRootCA1.pem  ← NO commitear
```
