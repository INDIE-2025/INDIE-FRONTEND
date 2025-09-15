# Sugerencias para el Backend - UsuarioController

## Endpoints adicionales que necesitas implementar:

### 1. Login de usuario
```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // Validar email y password
    Optional<Usuario> usuario = usuarioService.buscarPorEmail(loginRequest.getEmail());
    
    if (usuario.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), usuario.get().getPassword())) {
        // Generar JWT token
        String token = jwtUtil.generateToken(usuario.get());
        
        LoginResponse response = new LoginResponse(token, usuario.get());
        return ResponseEntity.ok(response);
    }
    
    return ResponseEntity.badRequest().body("Credenciales inválidas");
}
```

### 2. Clases DTO necesarias:

```java
// LoginRequest.java
public class LoginRequest {
    private String email;
    private String password;
    
    // Getters y setters
}

// LoginResponse.java
public class LoginResponse {
    private String token;
    private Usuario usuario;
    
    // Constructores, getters y setters
}
```

### 3. Configuración JWT (si no la tienes):
- Necesitarás Spring Security
- JWT utilities para generar y validar tokens
- Configurar CORS para tu frontend en localhost:4200

## Endpoints que ya tienes disponibles (por herencia de BaseController):

✅ GET /api/usuario - Obtener todos los usuarios
✅ GET /api/usuario/{id} - Obtener usuario por ID
✅ POST /api/usuario - Crear usuario (usa tu método registrar)
✅ PUT /api/usuario/{id} - Actualizar usuario
✅ DELETE /api/usuario/{id} - Eliminar usuario

## Estado actual del frontend:

El UserService ya está configurado para usar todos tus endpoints. Solo necesitas implementar el endpoint de login para que funcione completamente.

Por ahora, el login está simulado en el frontend hasta que implementes el endpoint real.
