# Cadastro de carro

**RF** => Requisitos funcionais
- Deve ser possível cadastrar um novo carro

**RN** => Regra de negócio
- Não deve ser possível cadastrar um carro com uma placa já existente.
- O carro deve ser cadastrado, por padrão, com disponibilidade
- O usuário responsável pelo cadastro deve ser um usuário administrador

# Listagem de carros
 
**RF**
- Deve ser possível listar todos os carros disponíveis
- Deve ser possível listar todos os carros disponíveis pelo nome da categoria
- Deve ser possível listar todos os carros disponíveis pelo nome da marca
- Deve ser possível listar todos os carros disponíveis pelo nome do carro

**RN**
- O usuário não precisa estar logado no sistema.

# Cadastro de Especificação no carro

**RF**
- Deve ser possível cadastrar uma especificação para um carro

**RN**
- Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
- Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

# Cadastro de imagens do carro

**RF**
- Deve ser possível cadastrar a imagem do carro

**RNF** => Requisito não funcional
- Utilizar o multer para upload dos arquivos

**RN**
- O usuários deve poder cadastrar mais de uma imagem para o mesmo carro
- O usuário responsável pelo cadastro deve ser um usuário administrador

# Agendamento de aluguel

**RF**
- Deve ser possível cadastrar um aluguel

**RN**
- O aluguel deve ter duração mínima de 1 dia.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro
- O usuário deve estar logado na aplicação

# Recuperar senha

**RF**
- Deve ser possível o usuário recuperar a senha informando o e-mail
- O usuário deve receber um e-mail com o passo a passo para a recuperação da senha
- O usuário deve conseguir inserir uma nova senha

**RN**
- O usuário precisar informar uma nova senha
- O link enviado para a recuperação deve expirar em 3 horas