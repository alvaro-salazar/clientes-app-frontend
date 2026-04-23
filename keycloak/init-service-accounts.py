"""
Asigna los roles de realm-management al service account de usuario-service.
Se ejecuta una vez al levantar el entorno Docker (keycloak-init).

Roles requeridos:
  - manage-users, view-users, query-users, query-groups, view-realm, manage-realm
"""
import json, sys, time, urllib.request, urllib.parse, urllib.error

BASE             = "http://keycloak:8080"
REALM            = "curso-springboot"
SA_CLIENT_ID     = "usuario-service"
NEEDED_ROLES     = {"manage-users", "view-users", "query-users",
                    "query-groups", "view-realm", "manage-realm"}


def get(url, token):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    return json.loads(urllib.request.urlopen(req).read())


def post(url, token, data):
    payload = json.dumps(data).encode()
    req = urllib.request.Request(
        url, data=payload,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    urllib.request.urlopen(req)


def admin_token():
    body = urllib.parse.urlencode({
        "grant_type": "password", "client_id": "admin-cli",
        "username": "admin", "password": "admin",
    }).encode()
    req = urllib.request.Request(
        f"{BASE}/realms/master/protocol/openid-connect/token", data=body
    )
    return json.loads(urllib.request.urlopen(req).read())["access_token"]


def wait_for_keycloak(retries=30, delay=10):
    url = f"{BASE}/realms/master"
    for i in range(retries):
        try:
            urllib.request.urlopen(url, timeout=5)
            print("[init] Keycloak listo")
            return
        except Exception:
            print(f"[init] Esperando Keycloak... ({i+1}/{retries})")
            time.sleep(delay)
    print("[init] ERROR: Keycloak no respondio a tiempo", file=sys.stderr)
    sys.exit(1)


def main():
    wait_for_keycloak()
    token = admin_token()

    # 1. Obtener el UUID del cliente usuario-service
    clients = get(f"{BASE}/admin/realms/{REALM}/clients?clientId={SA_CLIENT_ID}", token)
    if not clients:
        print(f"[init] ERROR: cliente '{SA_CLIENT_ID}' no encontrado en realm '{REALM}'", file=sys.stderr)
        sys.exit(1)
    client_uuid = clients[0]["id"]

    # 2. Obtener el usuario del service account
    sa_user = get(f"{BASE}/admin/realms/{REALM}/clients/{client_uuid}/service-account-user", token)
    sa_user_id = sa_user["id"]

    # 3. Obtener el UUID del cliente realm-management
    rm_clients = get(f"{BASE}/admin/realms/{REALM}/clients?clientId=realm-management", token)
    rm_uuid = rm_clients[0]["id"]

    # 4. Verificar roles ya asignados
    already = get(f"{BASE}/admin/realms/{REALM}/users/{sa_user_id}/role-mappings/clients/{rm_uuid}", token)
    already_names = {r["name"] for r in already}
    missing = NEEDED_ROLES - already_names

    if not missing:
        print(f"[init] Service account ya tiene todos los roles: {sorted(NEEDED_ROLES)}")
        return

    # 5. Asignar solo los roles que faltan
    all_rm_roles = get(f"{BASE}/admin/realms/{REALM}/clients/{rm_uuid}/roles", token)
    to_assign = [r for r in all_rm_roles if r["name"] in missing]

    post(f"{BASE}/admin/realms/{REALM}/users/{sa_user_id}/role-mappings/clients/{rm_uuid}", token, to_assign)
    print(f"[init] Roles asignados a service-account-{SA_CLIENT_ID}: {sorted(missing)}")


if __name__ == "__main__":
    main()
