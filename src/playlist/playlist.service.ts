import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Playlist } from './entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepository: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    const playList = new Playlist();
    playList.name = createPlaylistDto.name;

    // songs will be the array of ids that we are getting from the DTO object
    const songs = await this.songsRepository.findByIds(createPlaylistDto.songs);
    // set the relation for the songs with playlist entity
    playList.songs = songs;

    // A user will be the id of the user we are getting from the request
    // when we implemented the user authentication this id will become the loggedIn user id
    const user = await this.userRepository.findOneBy({
      id: createPlaylistDto.user,
    });
    playList.user = user;

    return this.playListRepository.save(playList);
  }

  findAll() {
    return `This action returns all playlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    console.log(updatePlaylistDto);
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
