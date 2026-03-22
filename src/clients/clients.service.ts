import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Message } from '../whatsapp/entities/message.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return client;
  }

  async findByGroupId(whatsappGroupId: string): Promise<Client | null> {
    return this.clientRepo.findOne({ where: { whatsappGroupId } });
  }

  create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientRepo.create(dto);
    return this.clientRepo.save(client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientRepo.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepo.remove(client);
  }

  getMessages(clientId: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: { clientId },
      order: { sentAt: 'DESC' },
    });
  }
}
