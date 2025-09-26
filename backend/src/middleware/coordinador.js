function isCoordinator(request, response, next) {
  if (!request.user) {
    return response.status(401).json({ message: "Não autenticado" })
  }

  if (request.user.role !== 2) {
    return response.status(403).json({ message: "Acesso negado: apenas coordenadores" })
  }

  next()
}
