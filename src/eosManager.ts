import fetch from 'node-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import { Account } from './accounts';

export class EOSManager {
	static adminAccount: Account;
	static signatureProvider: JsSignatureProvider;
	static api: Api;
	static rpc: JsonRpc;

	static initWithDefaults = () => {
		const adminPrivateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
		EOSManager.adminAccount = new Account('eosio', adminPrivateKey);
		EOSManager.signatureProvider = new JsSignatureProvider([adminPrivateKey]);

		// Typecasting as any here to prevent a problem with the types disagreeing for fetch,
		// when this is actually following the getting started docs on EOSJS.
		EOSManager.rpc = new JsonRpc('http://127.0.0.1:8888', { fetch: fetch as any });
		EOSManager.api = new Api({
			rpc: EOSManager.rpc,
			signatureProvider: EOSManager.signatureProvider,
			// Same deal here, type mismatch when there really shouldn't be.
			textDecoder: new TextDecoder() as any,
			textEncoder: new TextEncoder(),
		});
	};

	static transact = (
		transaction: any,
		eos = EOSManager.api,
		options = { blocksBehind: 0, expireSeconds: 30 }
	) => {
		return eos.transact(transaction, options);
	};
}