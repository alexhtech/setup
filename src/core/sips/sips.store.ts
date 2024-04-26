import { injectable } from 'inversify';
import { action, observable } from 'mobx';

import { ApiService } from '../api/api.service';
import { GetSips } from '../api/gql/sip/get-sips.gql.generated';
import { SipFragment } from '../api/gql/sip/sip.fragment.gql.generated';

@injectable()
export class SipsStore {
  private loadingPromise: Promise<unknown> | null = null;

  @observable.shallow
  sips: SipFragment[] = [];

  constructor(private readonly apiService: ApiService) {}

  readonly init = () => {
    if (!this.loadingPromise) {
      this.loadingPromise = this.load();
    }

    return this.loadingPromise;
  };

  private load = async () => {
    const result = await this.apiService.query(GetSips);

    this.setSips(result.getSips);
  };

  @action
  private setSips = (sips: SipFragment[]) => {
    this.sips = sips;
  };
}
