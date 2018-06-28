import {
  getProfile,
  OverwatchPlatform,
  OverwatchServerRegion,
  ProfileApiResponse,
  owl,
  getStats,
  StatsApiResponse,
  CompetitiveTopHeroData,
} from 'overwatch-api';

const platform: OverwatchPlatform = 'pc';
const region: OverwatchServerRegion = 'us';
const battleTag: string = sanitizeBattleTag('sparK#12434');

function privateProfileMessage(btag: string): string {
  return `Profile for battletag ${btag} is private, cannot retrieve profile`;
}

function sanitizeBattleTag(btag: string): string {
  return btag.replace('#', '-');
}

getProfile(platform, region, battleTag, (err: Error | null, data: ProfileApiResponse) => {
    if (err === null) {
      if (data.private) {
        console.log(privateProfileMessage(battleTag));
      } else {
        console.log(`Username: ${data.username}`);
        console.log(`Level: ${data.level}`);
        console.log(`Rank: ${data.competitive.rank} SR`);
        console.log(`Win Rate in Competitive: ${data.games.competitive.win_rate}`);
      }
    } else {
      console.log(err);
    }
  },
);

getStats(platform, region, battleTag, (err: Error | null, data: StatsApiResponse) => {
    if (err === null) {
      if (data.private) {
        console.log(privateProfileMessage(battleTag));
      } else {
        console.log(`Username: ${data.username}`);
        console.log(`Level: ${data.level}`);
        console.log(`Competitive Stats`);
        const topHeroesComp: CompetitiveTopHeroData = data.stats.top_heroes.competitive;
        console.log(`Hero with most games won: ${topHeroesComp.games_won[0].hero}`);
        console.log(`Hero with highest winrate: ${topHeroesComp.win_rate[0].hero}`);
        console.log(`Hero with most time played: ${topHeroesComp.played[0].hero}\n`);

        for (const stat of data.stats.game.competitive) {
          console.log(`${stat.title}: ${stat.value}`);
        }
      }
    } else {
      console.log(err);
    }
  },
);

owl.getStandings((err: Error | null, data: owl.ApiResponse<owl.TeamStandingInfo[]>) => {
    if (err === null) {
      const standingInfo: owl.TeamStandingInfo = data.data[0];
      console.log(`${standingInfo.name} - ${standingInfo.abbreviatedName}`);
      const leagueInfo: owl.StandingInfo = standingInfo.league;
      console.log('Season Game Wins/Losses');
      console.log(`${leagueInfo.gameWin}W - ${leagueInfo.gameLoss}L`);
      console.log('Season Match Wins/Losses');
      console.log(`${leagueInfo.matchWin}W - ${leagueInfo.matchLoss}L`);
    } else {
      console.log(err);
    }
  },
);
