export interface Usuario {
  id: string;
  emailUsuario: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
  nombreUsuario?: string;
  tipoUsuario?: string;
  subtipoUsuario?: string;
  descripcionUsuario?: string;
  apellidoUsuario?: string;
  username?: string;
  fechaVerificacion?: Date;
  youtubeUsuario?: string;
  spotifyUsuario?: string;
  instagramUsuario?: string;
  ubicacion?: string;
  sitioWeb?: string;
}
