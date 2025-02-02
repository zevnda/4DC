import { promisify } from 'util';
import glob from 'glob';
const PG = promisify(glob);

export default async (client) => {
    const commandsArr = [];
    // globalCom = [];
    (await PG(`${process.cwd()}/commands/*/*/*.js`)).map(async (file) => {
        const commandModule = await import('file://' + file);
        const command = commandModule.default;
        client.commands.set(command.name, command);
        if (!command.global) commandsArr.push(command);
        // if (command.global) globalCom.push(command);
    });
    client.on('ready', async () => {
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        guild.commands.set(commandsArr);
        // client.application.commands.set(globalCom);
    });
};